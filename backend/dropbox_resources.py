import os

from dropbox_utils import DropboxManager

from werkzeug import utils, datastructures
from flask_restful import reqparse, Resource


dropbox_connection_parser = reqparse.RequestParser()
dropbox_connection_parser.add_argument(
    'dropboxAccessToken', required=True, help="dropboxAccessToken cannot be blank!"
)


class DropboxConnection(Resource):
    def get(self):
        return {"hello": "world"}, 200

    def post(self):
        args = dropbox_connection_parser.parse_args()

        DropboxManager.get_client_dropbox(
            dropbox_access_token=args['dropboxAccessToken'],
        )

        response = {
            'platform': 'dropbox',
        }
        return {"data": response}, 200


dropbox_list_parser = reqparse.RequestParser()
dropbox_list_parser.add_argument(
    'prefix',
    required=True,
    help="prefix cannot be blank!")


class DropboxList(Resource):
    def post(self):
        args = dropbox_list_parser.parse_args()
        response = DropboxManager.list_paths_dropbox(
            prefix=args['prefix'],
        )
        return {"data": response}, 200


dropbox_download_parser = reqparse.RequestParser()
dropbox_download_parser.add_argument(
    'objectName',
    required=True,
    help="object_name cannot be blank!")


class DropboxDownload(Resource):
    def post(self):
        args = dropbox_download_parser.parse_args()
        response = DropboxManager.create_presigned_url(
            object_name=args['objectName'],
        )
        return {"data": response}, 200


dropbox_upload_parser = reqparse.RequestParser()
dropbox_upload_parser.add_argument(
    'fileToUpload',
    required=True,
    # help="Name cannot be blank!",
    type=datastructures.FileStorage,
    location='files'
    )
dropbox_upload_parser.add_argument(
    'uploadPath',
    required=True,
    location='form')


class DropboxFileUpload(Resource):
    def post(self):
        args = dropbox_upload_parser.parse_args()
        filename = utils.secure_filename(args['fileToUpload'].filename)
        args['fileToUpload'].save(filename)
        upload_path = args['uploadPath']
        DropboxManager.upload_file_dropbox(
            filename,
            upload_path
        )
        os.remove(filename)
        return {"data": 'Success'}, 200
