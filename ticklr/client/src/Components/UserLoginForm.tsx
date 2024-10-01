
export const UserLoginForm = () => {
  return (
    <div>
    <h2>Login</h2>
    <h6>Email</h6><input id="userEmail" className="form-control" type ="email"></input>
    <h6>Password</h6><input id="userPassword" className="form-control" type ="password"></input>
    <button type="button" className="btn btn-primary w-100">Login</button>
    </div>
  )
}
