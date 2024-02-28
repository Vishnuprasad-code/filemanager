import os

from gcloud_utils import GcloudManager

from werkzeug import utils, datastructures
from flask_restful import reqparse, Resource


gcloud_connection_parser = reqparse.RequestParser()
gcloud_connection_parser.add_argument(
    'keyfileJson', required=True, help="keyfileJson cannot be blank!"
)
gcloud_connection_parser.add_argument(
    'bucketName', required=True, help="bucketName cannot be blank!"
)


class GcloudConnection(Resource):
    def get(self):
        return {"hello": "world"}, 200

    def post(self):
        args = gcloud_connection_parser.parse_args()

        GcloudManager.get_client_gcloud(
            keyfile_json=args['keyfileJson'],
        )

        response = {
            'bucketName': args.get('bucketName'),
            'platform': 'gcloud',
        }
        return {"data": response}, 200


gcloud_list_parser = reqparse.RequestParser()
gcloud_list_parser.add_argument(
    'bucketName',
    required=True,
    help="bucket_name cannot be blank!")
gcloud_list_parser.add_argument(
    'prefix',
    required=True,
    help="prefix cannot be blank!")


class GcloudList(Resource):
    def post(self):
        args = gcloud_list_parser.parse_args()
        response = GcloudManager.list_paths_gcloud(
            bucket_name=args['bucketName'],
            prefix=args['prefix'],
        )
        return {"data": response}, 200


gcloud_download_parser = reqparse.RequestParser()
gcloud_download_parser.add_argument(
    'bucketName',
    required=True,
    help="bucket_name cannot be blank!")
gcloud_download_parser.add_argument(
    'objectName',
    required=True,
    help="object_name cannot be blank!")


class GcloudDownload(Resource):
    def post(self):
        args = gcloud_download_parser.parse_args()
        response = GcloudManager.create_presigned_url(
            bucket_name=args['bucketName'],
            object_name=args['objectName'],
            expiration=60
        )
        return {"data": response}, 200


gcloud_upload_parser = reqparse.RequestParser()
gcloud_upload_parser.add_argument(
    'fileToUpload',
    required=True,
    # help="Name cannot be blank!",
    type=datastructures.FileStorage,
    location='files'
    )
gcloud_upload_parser.add_argument(
    'bucketName',
    required=True,
    location='form')
gcloud_upload_parser.add_argument(
    'uploadPath',
    required=True,
    location='form')


class GcloudFileUpload(Resource):
    def post(self):
        args = gcloud_upload_parser.parse_args()
        filename = utils.secure_filename(args['fileToUpload'].filename)
        args['fileToUpload'].save(filename)
        bucket_name = args['bucketName']
        upload_path = args['uploadPath']
        GcloudManager.upload_file_gcloud(
            bucket_name,
            filename,
            upload_path
        )
        os.remove(filename)
        return {"data": 'Success'}, 200
