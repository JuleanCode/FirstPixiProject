import {useContext, useEffect} from "react";
import {VolumeContext} from "./VolumeProvider";

const Meter = () => {
        const audioContext = new (window.AudioContext)();
        const {setVolume} = useContext(VolumeContext)
        useEffect(() => {
            navigator.mediaDevices.getUserMedia({audio: true})
                .then(function (stream) {
                    const source = audioContext.createMediaStreamSource(stream);
                    const analyser = audioContext.createAnalyser();
                    analyser.fftSize = 2048;
                    source.connect(analyser);
                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);
                    function analyzeVolume() {
                        analyser.getByteFrequencyData(dataArray);
                        let sum = 0;
                        for (let i = 0; i < bufferLength; i++) {
                            sum += dataArray[i];
                        }
                        setVolume(sum / bufferLength)
                        requestAnimationFrame(analyzeVolume);
                    }
                    analyzeVolume();
                })
                .catch(function (err) {
                    console.error('Error accessing microphone: ', err);
                });
        }, []);
    }
;

export default Meter;