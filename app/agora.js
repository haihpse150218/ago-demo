import AgoraRTC from "agora-rtc-sdk-ng";

let agoraEngine = null;
let localPlayerContainer = null;
let remotePlayerContainer = null;
let channelParameters = {
    localAudioTrack: null,
    localVideoTrack: null,
    remoteAudioTrack: null,
    remoteVideoTrack: null,
    remoteUid: null,
};
const createDiv = (id, textContent) => {
    // Increment the divCount to generate unique IDs for each div
    const newDiv = document.createElement("div");
    newDiv.id = id;
    newDiv.textContent = textContent;
    newDiv.style.width = "640px";
    newDiv.style.height = "480px";
    newDiv.style.padding = "15px 5px 5px 5px";

    // Append the new div to the DOM
    return newDiv

};

export async function initializeAgora() {
    agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp9" });
    agoraEngine.on("user-published", async (user, mediaType) => {
        // Subscribe to the remote user when the SDK triggers the "user-published" event.
        await agoraEngine.subscribe(user, mediaType);
        console.log("subscribe success");
        console.log(`user: ${user}`);
        // Subscribe and play the remote video in the container If the remote user publishes a video track.
        console.log('check1111111111111111')
        if (mediaType == "video") {
            console.log('check1111111111111111')
            // Retrieve the remote video track.
            channelParameters.remoteVideoTrack = user.videoTrack;
            // Retrieve the remote audio track.
            channelParameters.remoteAudioTrack = user.audioTrack;
            // Save the remote user id for reuse.
            channelParameters.remoteUid = user.uid.toString();
            // Specify the ID of the DIV container. You can use the uid of the remote user.
            remotePlayerContainer = createDiv(user.uid.toString(), "Remote user " + user.uid.toString())
            channelParameters.remoteUid = user.uid.toString();
            // Append the remote container to the page body.    
            console.log('checkkkkkkkkkkkkkkkk')
            console.log(remotePlayerContainer)
            document.body.append(remotePlayerContainer);
            // Play the remote video track.
            channelParameters.remoteVideoTrack.play(remotePlayerContainer);
        }
        // Subscribe and play the remote audio track If the remote user publishes the audio track only.
        if (mediaType == "audio") {
            // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
            channelParameters.remoteAudioTrack = user.audioTrack;
            // Play the remote audio track. No need to pass any DOM element.
            channelParameters.remoteAudioTrack.play();
        }
        // Listen for the "user-unpublished" event.
        agoraEngine.on("user-unpublished", user => {
            console.log(user.uid + "has left the channel");
        });
    });
}

export async function joinChannel(appId, channelName, token, uid) {
    // Join the channel
    await agoraEngine.join(appId, channelName, token, uid);

    // Create local audio and video tracks
    channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    localPlayerContainer = createDiv(uid, "Local user " + uid)
    document.body.appendChild(localPlayerContainer);
    // Publish local tracks
    await agoraEngine.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack]);
    channelParameters.localVideoTrack.play(localPlayerContainer);
}

export async function leaveChannel() {
    // Leave the channel
    await agoraEngine.leave();

    // Cleanup local tracks and containers
    channelParameters.localAudioTrack.close();
    channelParameters.localVideoTrack.close();
    removeVideoDiv(remotePlayerContainer.id);
    removeVideoDiv(localPlayerContainer.id);

    agoraEngine.removeAllListeners(); // Remove all event listeners
}

// Define the removeVideoDiv function here as you did in your main.js
function removeVideoDiv(elementId) {
    console.log("Removing " + elementId + "Div");
    let Div = document.getElementById(elementId);
    if (Div) {
        Div.remove();
    }
}

