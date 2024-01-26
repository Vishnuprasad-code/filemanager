import "./CredentialComponent.css";
import { CredentialComponentsProps } from '../Types/types.tsx'



export default function CredentialComponent(
    { onConnect, connecting } : CredentialComponentsProps
) {
    let submitButtonText = 'Connect';
    if (connecting) {
        submitButtonText = 'Connecting ...';
    }
    return (
    <form className="credential-form" onSubmit={onConnect}>
        <div className="credential-element-wrap">
        <div className="credential-element">
            <label htmlFor="aws_access_key_id">Access Key*: </label>
            <input type="text" name="aws_access_key_id" />
        </div>
        <div className="credential-element">
            <label htmlFor="aws_secret_access_key">Sectret Key*:</label>
            <input type="text" name="aws_secret_access_key" />
        </div>
        <div className="credential-element">
            <label htmlFor="bucket_name">Bucket*: </label>
            <input type="text" name="bucket_name" />
        </div>
        <div className="credential-element">
            <label htmlFor="region_name">Region Name: </label>
            <input type="text" name="region_name" placeholder="us-east-1" defaultValue="us-east-1"/>
        </div>
        <div className="credential-element">
            <label htmlFor="signature_version">Signature Version: </label>
            <input type="text" name="signature_version" placeholder="s3v4" defaultValue="s3v4"/>
        </div>
        </div>
        <button className="credential-submit" type="submit">{ submitButtonText} </button>
    </form>
    )
}