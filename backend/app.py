import os
# from traceback import format_exc

from flask import Flask
from werkzeug import utils, datastructures
from flask_restful import reqparse, Api, Resource

from s3_util import S3Manager


app = Flask(__name__)
api = Api(app)
s3_manager = S3Manager()


s3_connection_parser = reqparse.RequestParser()
s3_connection_parser.add_argument(
    'bucketName', required=True, help="bucket_name cannot be blank!"
)
s3_connection_parser.add_argument(
    'awsAccessKeyId',
    required=True,
    help="aws_access_key_id cannot be blank!"
)
s3_connection_parser.add_argument(
    'awsSecretAccessKey',
    required=True,
    help="aws_secret_access_key cannot be blank!")
s3_connection_parser.add_argument(
    'regionName',
    required=True,
    help="region_name cannot be blank!")
s3_connection_parser.add_argument(
    'signatureVersion',
    required=True,
    help="signature_version cannot be blank!")


class S3Connection(Resource):
    def get(self):
        return {"hello": "world"}, 200

    def post(self):
        args = s3_connection_parser.parse_args()

        s3_manager.get_client_s3(
            aws_access_key_id=args['awsAccessKeyId'],
            aws_secret_access_key=args['awsSecretAccessKey'],
            bucket_name=args['bucketName'],
            region_name=args['regionName'],
            signature_version=args['signatureVersion'],
        )

        response = {
            'bucketName': args.get('bucketName'),
        }
        return {"data": response}, 200


s3_list_parser = reqparse.RequestParser()
s3_list_parser.add_argument(
    'bucketName',
    required=True,
    help="bucket_name cannot be blank!")
s3_list_parser.add_argument(
    'prefix',
    required=True,
    help="prefix cannot be blank!")


class S3List(Resource):
    def post(self):
        args = s3_list_parser.parse_args()
        response = s3_manager.list_paths_s3(
            bucket_name=args['bucketName'],
            prefix=args['prefix'],
        )
        return {"data": response}, 200


s3_download_parser = reqparse.RequestParser()
s3_download_parser.add_argument(
    'bucketName',
    required=True,
    help="bucket_name cannot be blank!")
s3_download_parser.add_argument(
    'objectName',
    required=True,
    help="object_name cannot be blank!")


class S3Download(Resource):
    def post(self):
        args = s3_download_parser.parse_args()
        response = s3_manager.create_presigned_url(
            bucket_name=args['bucketName'],
            object_name=args['objectName'],
            expiration=60
        )
        return {"data": response}, 200


s3_upload_parser = reqparse.RequestParser()
s3_upload_parser.add_argument(
    'fileToUpload',
    required=True,
    # help="Name cannot be blank!",
    type=datastructures.FileStorage,
    location='files'
    )
s3_upload_parser.add_argument(
    'bucketName',
    required=True,
    location='form')
s3_upload_parser.add_argument(
    'uploadPath',
    required=True,
    location='form')


class s3FileUpload(Resource):
    def post(self):
        args = s3_upload_parser.parse_args()
        print(f'args: {args}')
        filename = utils.secure_filename(args['fileToUpload'].filename)
        args['fileToUpload'].save(filename)
        bucket_name = args['bucketName']
        upload_path = args['uploadPath']
        s3_manager.upload_file_s3(
            bucket_name,
            filename,
            upload_path
        )
        os.remove(filename)
        return {"data": 'Success'}, 200


#  Actually setup the Api resource routing here
api.add_resource(S3Connection, '/api/s3/connect')
api.add_resource(S3List, '/api/s3/list')
api.add_resource(S3Download, '/api/s3/download')
api.add_resource(s3FileUpload, '/api/s3/upload')


@app.errorhandler(Exception)
def unhandled_error(error):
    return {'message': f'{str(error)}'}, 500


if __name__ == '__main__':
    # run app in debug mode on port 5000
    app.run(debug=True, port=5000, host='0.0.0.0')
