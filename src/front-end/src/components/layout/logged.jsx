import Create from '../utils/create.jsx';
import Bell from '../utils/bell.jsx';
import User from '../utils/user.jsx';
import { Link } from 'react-router-dom';


export default function RightSide({ isCreating }) {
    return (
        <div className="right-side flex items-center gap-7">

            {!isCreating &&
                <Link to="/create-post">
                    <Create />
                </Link>
                }
            <Bell />
            <User />
        </div>
    );
}