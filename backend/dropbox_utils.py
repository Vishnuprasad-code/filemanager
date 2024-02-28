from dropbox import Dropbox, files
from dropbox.exceptions import DropboxException


class DropboxManager():
    dropbox_client = None

    def capture_exception(function):
        def wraper_function(*args, **kwargs):
            try:
                return function(*args, **kwargs)
            except DropboxException as e:
                return {'message': f'DropboxException {e}'}
        return wraper_function

    def __init__(self, dropbox_client=None):
        self.dropbox_client = dropbox_client

    @classmethod
    @capture_exception
    def get_client_dropbox(
        cls,
        dropbox_access_token
    ):
        cls.dropbox_client = Dropbox(dropbox_access_token)
        return cls.dropbox_client

    @classmethod
    @capture_exception
    def list_paths_dropbox(cls, prefix=""):
        prefix = prefix.strip()
        if prefix:
            prefix = '/' + prefix.strip('/ ')
        last_directory = prefix.strip('/').split('/')[-1]
        if '.' in last_directory:
            prefix = "/" + "/".join(prefix.strip('/').split('/')[:-1])

        file_path_list = []
        entries = getattr(cls.dropbox_client.files_list_folder(prefix), 'entries', [])
        for entry in entries:
            file_name = getattr(entry, 'path_display', '')
            file_name = file_name.strip('/ ').replace(prefix.strip('/ '), '').strip('/ ')
            file_type = cls.get_file_or_folder(entry)
            if file_type == 'Folder':
                file_name = file_name + "/"
            file_path_dict = {
                'type': file_type,
                'fileName': file_name,
                'sizeInfo': getattr(entry, 'size', None),
                'displaySize': cls.format_bytes(getattr(entry, 'size', None)),
                'lastModified': cls.get_last_modified(entry)
            }
            file_path_list.append(file_path_dict)

        path_list = sorted(file_path_list, key=lambda d: d['lastModified'] or '', reverse=True)
        response = {
            'filePaths': path_list,
            'prefix': prefix,
        }
        return response

    @classmethod
    @capture_exception
    def create_presigned_url(cls, object_name):
        response = {
            'url': None,
        }
        object_name = '/' + object_name.strip('/ ')
        shared_link_metadata = cls.dropbox_client.sharing_create_shared_link(object_name)
        response['url'] = shared_link_metadata.url.replace('&dl=0', '&dl=1')

        return response

    @classmethod
    @capture_exception
    def upload_file_dropbox(cls, file_name, object_name):
        object_name = '/' + object_name.strip('/ ')
        with open(file_name, "rb") as f:
            meta = cls.dropbox_client.files_upload(
                f.read(), object_name, mode=files.WriteMode("overwrite")
            )
        return {'data': 'File Upload Success'}

    @staticmethod
    def format_bytes(size):
        if not size:
            return
        units = ['B', 'KB', 'MB', 'GB']
        unit_size = 1024
        unit_index = 0

        while size >= unit_size and unit_index < len(units) - 1:
            size /= unit_size
            unit_index += 1

        return f'{size:.2f} {units[unit_index]}'

    @staticmethod
    def get_file_or_folder(entry):
        if isinstance(entry, files.FolderMetadata):
            return 'Folder'
        elif isinstance(entry, files.FileMetadata):
            return 'File'

        return 'Unknown'

    @staticmethod
    def get_last_modified(entry):
        client_modified = getattr(entry, 'client_modified', None)
        if not client_modified:
            return

        return client_modified.strftime('%Y-%m-%dT%H:%M:%S')
