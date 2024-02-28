import json
from oauth2client.service_account import ServiceAccountCredentials
from gcloud import storage
from google.api_core.exceptions import ClientError
from datetime import datetime, timedelta


class GcloudManager():
    gcloud_client = None

    def capture_exception(function):
        def wraper_function(*args, **kwargs):
            try:
                return function(*args, **kwargs)
            except ClientError as e:
                return {'message': f'Client Error {e}'}
        return wraper_function

    def __init__(self, gcloud_client=None):
        self.gcloud_client = gcloud_client

    @classmethod
    @capture_exception
    def get_client_gcloud(
        cls,
        keyfile_json
    ):
        keyfile_dict = cls.get_keyfile_dict(keyfile_json)
        credentials = ServiceAccountCredentials.from_json_keyfile_dict(keyfile_dict)
        cls.gcloud_client = storage.Client(credentials=credentials, project="test-project")
        return cls.gcloud_client

    @staticmethod
    def get_keyfile_dict(keyfile_json):
        keyfile_dict = None
        keyfile_json = " ".join(keyfile_json.split()).strip()
        for load_function in [json.loads, eval]:
            try:
                keyfile_dict = load_function(keyfile_json)
            except (json.decoder.JSONDecodeError, ValueError, SyntaxError):
                pass

        if not keyfile_dict:
            return None

        keyfile_dict = {
            k.lower().replace(' ', '_'): v for k, v in keyfile_dict.items()
        }
        keyfile_dict['private_key'] = keyfile_dict.pop('private_key', '').replace('\\n', '\n')
        return keyfile_dict

    @classmethod
    @capture_exception
    def list_paths_gcloud(cls, bucket_name, prefix=""):
        prefix = prefix.strip()
        if prefix:
            prefix = prefix.strip('/ ') + '/'
        last_directory = prefix.strip('/').split('/')[-1]
        if '.' in last_directory:
            prefix = "/".join(prefix.strip('/').split('/')[:-1])

        bucket = cls.gcloud_client.bucket(bucket_name)
        blobs = bucket.list_blobs(prefix=prefix, delimiter='/')

        file_path_list = []
        for blob in blobs:
            file_name = blob.name
            if not file_name:
                continue
            file_name = file_name.replace(prefix, '')
            if not file_name:
                continue
            file_path_dict = {
                'type': "File",
                'fileName': file_name,
                'sizeInfo': blob.size,
                'displaySize': cls.format_bytes(blob.size),
                'lastModified': blob.updated.strftime('%Y-%m-%dT%H:%M:%S')
            }
            file_path_list.append(file_path_dict)

        path_list = []
        for prefix_ in blobs.prefixes:
            if not prefix_:
                continue
            prefix_ = prefix_.replace(prefix, '')
            if not prefix_:
                continue
            folder_path_dict = {
                'type': "Folder",
                'fileName': prefix_,
                'sizeInfo': None,
                'displaySize': None,
                'lastModified': None
            }
            path_list.append(folder_path_dict)

        path_list.extend(sorted(file_path_list, key=lambda d: d['lastModified'], reverse=True))
        response = {
            'filePaths': path_list,
            'prefix': prefix,
        }
        return response

    @classmethod
    @capture_exception
    def create_presigned_url(cls, bucket_name, object_name, expiration=60):
        # Generate a presigned URL for the S3 object
        response = {
            'url': None,
        }
        bucket = cls.gcloud_client.bucket(bucket_name)
        blob = bucket.blob(object_name)

        # Set the expiration time for the URL
        expiration_time = datetime.utcnow() + timedelta(seconds=expiration)

        # Generate the pre-signed URL
        signed_url = blob.generate_signed_url(expiration_time)

        response['url'] = signed_url

        return response

    @classmethod
    @capture_exception
    def upload_file_gcloud(cls, bucket_name, file_name, object_name):
        bucket = cls.gcloud_client.bucket(bucket_name)
        blob = bucket.blob(object_name)  # creating a blob in cloud with object_name
        blob.upload_from_filename(file_name)  # upload our file
        return {'data': 'File Upload Success'}

    @staticmethod
    def format_bytes(size):
        units = ['B', 'KB', 'MB', 'GB']
        unit_size = 1024
        unit_index = 0

        while size >= unit_size and unit_index < len(units) - 1:
            size /= unit_size
            unit_index += 1

        return f'{size:.2f} {units[unit_index]}'
