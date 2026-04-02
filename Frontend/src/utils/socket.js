import io from "socket.io-client"

const createSocketConnection = ()=>{
    if(localhost.hostname === "localhost"){
        return io("http://localhost:5000")
    }else{
       return io("/",{path:"/api/socket.io"})
    }
}
export default createSocketConnection;