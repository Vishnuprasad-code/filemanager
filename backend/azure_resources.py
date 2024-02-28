import os

from azure_utils import AzureManager

from werkzeug import utils, datastructures
from flask_restful import reqparse, Resource


azure_connection_parser = reqparse.RequestParser()
azure_connection_parser.add_argument(
    'accountName', required=True, help="accountName cannot be blank!"
)
azure_connection_parser.add_argument(
    'sasToken', required=True, help="sasToken cannot be blank!"
)
azure_connection_parser.add_argument(
    'containerName', required=True, help="containerName cannot be blank!"
)


class AzureConnection(Resource):
    def get(self):
        return {"hello": "world"}, 200

    def post(self):
        args = azure_connection_parser.parse_args()

        AzureManager.get_client_azure(
            account_name=args['accountName'],
            sas_token=args['sasToken'],
        )

        response = {
            'containerName': args.get('containerName'),
            'platform': 'azure',
        }
        return {"data": response}, 200


azure_list_parser = reqparse.RequestParser()
azure_list_parser.add_argument(
    'containerName',
    required=True,
    help="containerName cannot be blank!")
azure_list_parser.add_argument(
    'prefix',
    required=True,
    help="prefix cannot be blank!")


class AzureList(Resource):
    def post(self):
        args = azure_list_parser.parse_args()
        response = AzureManager.list_paths_azure(
            container_name=args['containerName'],
            prefix=args['prefix'],
        )
        return {"data": response}, 200


azure_download_parser = reqparse.RequestParser()
azure_download_parser.add_argument(
    'containerName',
    required=True,
    help="containerName cannot be blank!")
azure_download_parser.add_argument(
    'objectName',
    required=True,
    help="object_name cannot be blank!")


class AzureDownload(Resource):
    def post(self):
        args = azure_download_parser.parse_args()
        response = AzureManager.create_presigned_url(
            container_name=args['containerName'],
            object_name=args['objectName'],
            expiration=60
        )
        return {"data": response}, 200


azure_upload_parser = reqparse.RequestParser()
azure_upload_parser.add_argument(
    'fileToUpload',
    required=True,
    # help="Name cannot be blank!",
    type=datastructures.FileStorage,
    location='files'
    )
azure_upload_parser.add_argument(
    'containerName',
    required=True,
    location='form')
azure_upload_parser.add_argument(
    'uploadPath',
    required=True,
    location='form')


class AzureFileUpload(Resource):
    def post(self):
        args = azure_upload_parser.parse_args()
        filename = utils.secure_filename(args['fileToUpload'].filename)
        args['fileToUpload'].save(filename)
        container_name = args['containerName']
        upload_path = args['uploadPath']
        AzureManager.upload_file_azure(
            container_name,
            filename,
            upload_path
        )
        os.remove(filename)
        return {"data": 'Success'}, 200
