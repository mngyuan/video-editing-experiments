# Trill Ring Seek

Seek with the Trill Ring sensor

## Encoding video for fast playback

[HAP video encoding instructions](https://gist.github.com/dlublin/e4585b872dd136ae88b2aa51a6a89aac)

```
ffmpeg -i input.mp4 -c:v hap output.mov
```

## Running an HTTP range request compatible server

Otherwise seeking to specific times won't work on Chrome

```
npx http-server -p 8000
```

## Max and Arduino

Max and Arduino have to be opened in the right order, since only one device can have full ownership of the serial port at a time (I believe).

### Max -> Arduino flow

open Max, then open Arduino and start your sketch / serial monitor
