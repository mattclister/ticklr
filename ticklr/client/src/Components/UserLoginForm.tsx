
interface Props {
  setLoggedIn: (boolean: boolean) => void
}

export const UserLoginForm = ({setLoggedIn}: Props) => {
  return (
    <div>
    <h2>Login</h2>
    <label className="form-label">Email</label><input id="userEmail" className="form-control" type ="email"></input>
    <label className="form-label">Password</label><input id="userPassword" className="form-control" type ="password"></input>
    <button type="button" className="btn btn-primary w-100" onClick={()=>setLoggedIn(true)}>Login</button>
    </div>
  )
}
