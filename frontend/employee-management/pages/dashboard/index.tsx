import { AuthService } from "../../services/HttpClient";

export default function Dashboard() {

    const userName = AuthService.getUserName();
    const userRole = AuthService.getUserRole();
    console.log(userName, userRole);
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}