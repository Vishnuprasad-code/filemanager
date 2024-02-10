from flask import Flask
from flask_restful import Api

from s3_resources import (
    S3Connection,
    S3List,
    S3Download,
    S3FileUpload,
)

from dropbox_resources import (
    DropboxConnection,
    DropboxList,
    DropboxDownload,
    DropboxFileUpload,
)


app = Flask(__name__)
api = Api(app)


#  Actually setup the Api resource routing here
api.add_resource(S3Connection, '/api/s3/connect')
api.add_resource(S3List, '/api/s3/list')
api.add_resource(S3Download, '/api/s3/download')
api.add_resource(S3FileUpload, '/api/s3/upload')


#  Actually setup the Api resource routing here
api.add_resource(DropboxConnection, '/api/dropbox/connect')
api.add_resource(DropboxList, '/api/dropbox/list')
api.add_resource(DropboxDownload, '/api/dropbox/download')
api.add_resource(DropboxFileUpload, '/api/dropbox/upload')


@app.errorhandler(Exception)
def unhandled_error(error):
    return {'message': f'{str(error)}'}, 500


if __name__ == '__main__':
    # run app in debug mode on port 5000
    app.run(debug=True, port=5000, host='0.0.0.0')
