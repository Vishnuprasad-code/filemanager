import "./CredentialComponent.css";
import { CredentialComponentsProps } from '../Types/types.ts'



export function S3CredentialComponent(
    { onConnect, connecting } : CredentialComponentsProps
) {
    let submitButtonText = 'Connect';
    if (connecting) {
        submitButtonText = 'Connecting ...';
    }
    return (
        <form className="credential-form" onSubmit={onConnect}>
        <div className="credential-element">
        <label htmlFor="awsAccessKeyId">Access Key*: </label>
            <input type="text" name="awsAccessKeyId" />
            <label htmlFor="awsSecretAccessKey">Sectret Key*:</label>
            <input type="text" name="awsSecretAccessKey" />
            <label htmlFor="bucketName">Bucket*: </label>
            <input type="text" name="bucketName" />
        </div>
        <div className="credential-element-default">
            <label htmlFor="regionName">Region Name: </label>
            <input type="text" name="regionName" placeholder="us-east-1" defaultValue="us-east-1"/>
            <label htmlFor="signatureVersion">Signature Version: </label>
            <input type="text" name="signatureVersion" placeholder="s3v4" defaultValue="s3v4"/>
        </div>

        <button className="credential-submit" type="submit">{ submitButtonText }</button>
    </form>
    )
}


export function DropBoxCredentialComponent(
    { onConnect, connecting }: CredentialComponentsProps
) {
    let submitButtonText = 'Connect';
    if (connecting) {
        submitButtonText = 'Connecting ...';
    }
    console.log(submitButtonText);
    return (
    <form className="credential-form" onSubmit={onConnect}>
        <div className="credential-element">
            <label htmlFor="dropboxAccessToken">Access Token*: </label>
            <input type="text" name="dropboxAccessToken" />
        </div>
        <div className="credential-element-default">
        </div>

        <button className="credential-submit" type="submit">{ submitButtonText }</button>
    </form>
    )
}