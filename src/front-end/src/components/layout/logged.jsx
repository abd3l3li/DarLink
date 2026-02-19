import Create from '../utils/create.jsx';
import Bell from '../utils/bell.jsx';
import User from '../utils/user.jsx';


export default function RightSide() {
    return (
        <div className="right-side flex items-center gap-7">
            <Create />
            <Bell />
            <User />
        </div>
    );
}