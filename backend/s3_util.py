import boto3
from botocore.client import Config
from botocore.exceptions import ClientError


class S3Manager():
    def __init__(self, s3_client=None):
        self.s3_client = s3_client

    def get_client_s3(
        self,
        aws_access_key_id,
        aws_secret_access_key,
        bucket_name=None,
        region_name='us-east-1',
        signature_version='s3v4'
    ):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name,
            config=Config(signature_version=signature_version)
        )
        return self.s3_client

    def list_paths_s3(self, bucket_name, prefix=""):
        prefix = prefix.strip()
        if prefix:
            prefix = prefix.strip('/ ') + '/'
        last_directory = prefix.strip('/').split('/')[-1]
        if '.' in last_directory:
            prefix = "/".join(prefix.strip('/').split('/')[:-1])

        paginator = self.s3_client.get_paginator('list_objects')
        result = paginator.paginate(
            Bucket=bucket_name, Prefix=prefix, Delimiter='/')
        path_list = []
        for common_prefix_dict in result.search('CommonPrefixes'):
            if not common_prefix_dict:
                continue
            file_name = common_prefix_dict.get('Prefix')
            if not file_name:
                continue
            file_name = file_name.replace(prefix, '')
            if not file_name:
                continue
            folder_path_dict = {
                'type': "Folder",
                'fileName': file_name,
                'sizeInfo': None,
                'displaySize': None,
                'lastModified': None
            }
            path_list.append(folder_path_dict)

        file_path_list = []
        for content_dict in result.search('Contents'):
            if not content_dict:
                continue
            file_name = content_dict.get('Key')
            if not file_name:
                continue
            file_name = file_name.replace(prefix, '')
            if not file_name:
                continue
            file_path_dict = {
                'type': "File",
                'fileName': file_name,
                'sizeInfo': content_dict.get('Size'),
                'displaySize': self.format_bytes(content_dict.get('Size')),
                'lastModified': content_dict.get('LastModified').strftime('%Y-%m-%dT%H:%M:%S')
            }
            file_path_list.append(file_path_dict)

        path_list.extend(sorted(file_path_list, key=lambda d: d['lastModified'], reverse=True))
        response = {
            'filePaths': path_list,
            'prefix': prefix,
        }
        return response

    def create_presigned_url(self, bucket_name, object_name, expiration=30):
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
        try:
            response['url'] = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': bucket_name,
                    'Key': object_name
                },
                ExpiresIn=expiration
            )
        except ClientError:
            response['url'] = None

        return response

    def upload_file_s3(self, bucket_name, file_name, object_name):
        try:
            self.s3_client.upload_file(file_name, bucket_name, object_name)
        except ClientError:
            pass

    @staticmethod
    def format_bytes(size):
        units = ['B', 'KB', 'MB', 'GB']
        unit_size = 1024
        unit_index = 0

        while size >= unit_size and unit_index < len(units) - 1:
            size /= unit_size
            unit_index += 1

        return f'{size:.2f} {units[unit_index]}'
