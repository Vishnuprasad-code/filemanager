from flask import Flask, jsonify
from flask_restful import Api
from flask import request, abort
from flask_wtf.csrf import CSRFProtect, validate_csrf, generate_csrf


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

from gcloud_resources import (
    GcloudConnection,
    GcloudList,
    GcloudDownload,
    GcloudFileUpload,
)

from azure_resources import (
    AzureConnection,
    AzureList,
    AzureDownload,
    AzureFileUpload
)

app = Flask(__name__)
api = Api(app)
app.secret_key = "super-secret-key"  # required for sessions
app.config.update(
    SECRET_KEY="super-secret-key",
    WTF_CSRF_TIME_LIMIT=None,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_HTTPONLY=True,
)
csrf = CSRFProtect(app)


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


#  Actually setup the Api resource routing here
api.add_resource(GcloudConnection, '/api/gcloud/connect')
api.add_resource(GcloudList, '/api/gcloud/list')
api.add_resource(GcloudDownload, '/api/gcloud/download')
api.add_resource(GcloudFileUpload, '/api/gcloud/upload')


#  Actually setup the Api resource routing here
api.add_resource(AzureConnection, '/api/azure/connect')
api.add_resource(AzureList, '/api/azure/list')
api.add_resource(AzureDownload, '/api/azure/download')
api.add_resource(AzureFileUpload, '/api/azure/upload')


@app.errorhandler(Exception)
def unhandled_error(error):
    return {'message': f'{str(error)}'}, 500


@app.route("/api/csrf-token", methods=["GET"])
def csrf_token():
    token = generate_csrf()

    response = jsonify({"csrfToken": token})
    response.set_cookie(
        "csrf_token",
        token,
        samesite="Lax",
        httponly=False,  # must be readable by JS
        secure=False    # True in production (HTTPS)
    )
    return response


@app.before_request
def enforce_api_csrf():
    if request.path in [
        "/api/csrf-token",
        "/api/login",
    ]:
        return
    if not request.path.startswith("/api/"):
        return
    
    if request.method not  in ("POST", "PUT", "PATCH", "DELETE"):
        return

    token = request.headers.get("X-CSRFToken")
    if not token:
        abort(403, "Missing CSRF token")

    try:
        validate_csrf(token)
    except Exception:
        abort(403, "Invalid CSRF token")
