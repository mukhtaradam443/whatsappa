import { Circle } from "better-react-spinkit";

function Loading() {
  return (
    <center style={{display:'grid', placeItems:'center', height:'100vh'}}>
      <div>
        <img src="https://i.ibb.co/Z8bzGGh/whatsapp.jpg" height={200 } 
        style={{marginBottom:10}}
        alt="" />
        <Circle color='#3CBC28' size={60}/>
      </div>
    </center>
  )
}

export default Loading
