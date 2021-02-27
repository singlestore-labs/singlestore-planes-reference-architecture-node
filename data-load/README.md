SingleStore Planes
------------------

This is a Node app written in TypeScript that reads data from the [Open Sky Network API](https://opensky-network.org/apidoc/rest.html) and deposits JSON files in an S3 bucket to get pulled in automatically by a SingleStore ingest pipeline.


## Usage

1. Edit `.env` if necessary to point to your AWS S3 or MinIO bucket.

2. run `npm run start` to launch the Node app.

3. Every 10 seconds it'll download a new file from the API.  Open Sky Network caches their data for 10 seconds for free accounts.


## License

MIT
