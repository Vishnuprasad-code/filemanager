import { Link } from 'react-router-dom'

export default function HomePage(){
    return (
        <div className="platform-menu">
            <h4>Choose platform</h4>
        <ul>
            <Link style={{ textDecoration: 'none' }} to="s3"><li className="platform-item">s3</li></Link>
            <Link style={{ textDecoration: 'none' }} to="dropbox"><li className="platform-item">Dropbox</li></Link>
            <Link style={{ textDecoration: 'none' }} to="gcloud"><li className="platform-item">Gcloud</li></Link>
            <Link style={{ textDecoration: 'none' }} to="azure"><li className="platform-item">Azure</li></Link>
        </ul>
        </div>

    )
}