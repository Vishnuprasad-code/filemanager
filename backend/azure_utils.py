# from datetime import datetime
from azure.core.exceptions import AzureError
from azure.storage.blob import (
    BlobServiceClient,
    # BlobSasPermissions,
    # generate_blob_sas
)


class AzureManager():
    azure_client = None

    def capture_exception(function):
        def wraper_function(*args, **kwargs):
            try:
                return function(*args, **kwargs)
            except AzureError as e:
                return {'message': f'Client Error {e}'}
        return wraper_function

    def __init__(self, azure_client=None):
        self.azure_client = azure_client

    @classmethod
    @capture_exception
    def get_client_azure(
        cls,
        account_name,
        sas_token,
    ):
        sas_token = f"?{sas_token.lstrip('?')}"
        cls.azure_client = BlobServiceClient(account_url=f"https://{account_name}.blob.core.windows.net{sas_token}")
        return cls.azure_client

    @classmethod
    @capture_exception
    def list_paths_azure(cls, container_name, prefix=""):
        prefix = prefix.strip()
        if prefix:
            prefix = prefix.strip('/ ') + '/'
        last_directory = prefix.strip('/').split('/')[-1]
        if '.' in last_directory:
            prefix = "/".join(prefix.strip('/').split('/')[:-1])

        container_client = cls.azure_client.get_container_client(container=container_name)
        blobs = container_client.walk_blobs(name_starts_with=prefix)
        path_list = []
        file_path_list = []
        for blob in blobs:
            file_name = blob.name
            file_name = file_name.replace(prefix, '')
            if file_name.endswith('/'):
                folder_path_dict = {
                    'type': "Folder",
                    'fileName': file_name,
                    'sizeInfo': None,
                    'displaySize': None,
                    'lastModified': None
                }
                path_list.append(folder_path_dict)
                continue

            file_path_dict = {
                'type': "File",
                'fileName': file_name,
                'sizeInfo': blob.size,
                'displaySize': cls.format_bytes(blob.size),
                'lastModified': blob.last_modified.strftime('%Y-%m-%dT%H:%M:%S')
            }
            file_path_list.append(file_path_dict)

        path_list.extend(sorted(file_path_list, key=lambda d: d['lastModified'], reverse=True))
        response = {
            'filePaths': path_list,
            'prefix': prefix,
        }
        return response

    @classmethod
    @capture_exception
    def create_presigned_url(cls, container_name, object_name, expiration=None):
        """Generate a presigned URL to share an S3 object

        :param bucket_name: string
        :param object_name: string
        :param expiration: Time in seconds for the presigned URL to remain valid
        :return: Presigned URL as string. If error, returns None.
        """

        # Generate a presigned URL for the S3 object
        response = {
            'url': None,
        }

        blob_client = cls.azure_client.get_blob_client(container=container_name, blob=object_name)
        response['url'] = blob_client.url
        return response

    @classmethod
    @capture_exception
    def upload_file_azure(cls, container_name, file_name, object_name):
        container_client = cls.azure_client.get_container_client(container=container_name)
        with open(file=file_name, mode="rb") as data:
            container_client.upload_blob(name=object_name, data=data, overwrite=True)

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
