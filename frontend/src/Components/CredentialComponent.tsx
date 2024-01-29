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
            <label htmlFor="awsAccessKeyId">Access Key*: </label>
            <input type="text" name="awsAccessKeyId" />
        </div>
        <div className="credential-element">
            <label htmlFor="awsSecretAccessKey">Sectret Key*:</label>
            <input type="text" name="awsSecretAccessKey" />
        </div>
        <div className="credential-element">
            <label htmlFor="bucketName">Bucket*: </label>
            <input type="text" name="bucketName" />
        </div>
        <div className="credential-element">
            <label htmlFor="regionName">Region Name: </label>
            <input type="text" name="regionName" placeholder="us-east-1" defaultValue="us-east-1"/>
        </div>
        <div className="credential-element">
            <label htmlFor="signatureVersion">Signature Version: </label>
            <input type="text" name="signatureVersion" placeholder="s3v4" defaultValue="s3v4"/>
        </div>
        </div>
        <button className="credential-submit" type="submit">{ submitButtonText }</button>
    </form>
    )
}