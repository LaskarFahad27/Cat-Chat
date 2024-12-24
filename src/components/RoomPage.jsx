import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'

const RoomPage = () =>{
    const { roomId } = useParams();

    const myMeeting = async (element) => {
        const appID = 378525498;
        const serverSecret = "29a9d171c34c88bed9c6849b73b6aa6b";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, Date.now().toString(), "CatChat User" );
        const zc = ZegoUIKitPrebuilt.create(kitToken);
        zc.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: 'Copy Link',
                    url: `http://localhost5173/room/${roomId}`
                }
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.GroupCall
            }
        })
    }
    return(
        
            <div>
                <div ref={myMeeting} />
            </div> 
    )
};
export default RoomPage;