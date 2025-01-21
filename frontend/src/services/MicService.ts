import { RWSService } from '@rws-framework/client';

interface IMicConfig {
    sampleRate?: number;
    channelCount?: number;
    deviceId?: string
}

class MicService extends RWSService {
    private stream: MediaStream | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private chunks: Blob[] = [];
    private isRecording: boolean = false;
    private devices: MediaDeviceInfo[] = [];

    private config: IMicConfig = {
        sampleRate: 16000,
        channelCount: 1,
        deviceId: null
    };

    private streamingCallback: (data: Blob) => void = null;

    setMicStreamCallback(callback: (data: Blob) => void): void
    {   
        this.streamingCallback = callback;
    }

    onStreamChunk(data: Blob): void
    {        
        if(this.streamingCallback !== null){this.streamingCallback(data);}
    }

    async getAudioDevices(): Promise<MediaDeviceInfo[]> {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true }); // Request permission
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.devices = devices.filter(device => device.kind === 'audioinput');
            return this.devices;
        } catch (error) {
            console.error('Error getting audio devices:', error);
            return [];
        }
    }

    async initialize(config?: IMicConfig): Promise<boolean> {
        try {
            this.config = { ...this.config, ...config };
            
            const constraints = {
                audio: {
                    deviceId: this.config.deviceId ? { exact: this.config.deviceId } : undefined,
                    sampleRate: this.config.sampleRate,
                    channelCount: this.config.channelCount,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            return true;
        } catch (error) {
            console.error('Error initializing microphone:', error);
            return false;
        }
    }    

    startRecording(): boolean {
        if (!this.stream || this.isRecording) {
            return false;
        }

        this.chunks = [];
        this.mediaRecorder = new MediaRecorder(this.stream, {
            mimeType: 'audio/webm;codecs=opus',
            audioBitsPerSecond: 128000
        });

        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.chunks.push(event.data);
                
                this.onStreamChunk(event.data);
            }
        };

        this.mediaRecorder.start(100);
        this.isRecording = true;
        return true;
    }

    stopRecording(): Blob | null {
        if (!this.mediaRecorder || !this.isRecording) {
            return null;
        }

        this.mediaRecorder.stop();
        this.isRecording = false;

        const audioBlob = new Blob(this.chunks, { type: 'audio/webm' });
        this.chunks = [];
        return audioBlob;
    }

    getStream(): MediaStream | null {
        return this.stream;
    }

    isInitialized(): boolean {
        return this.stream !== null;
    }

    close(): void {
        if (this.isRecording) {
            this.stopRecording();
        }

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }
}

export default MicService.getSingleton();
export { MicService as MicServiceInstance };