function identifyInputType(inputString) {
    const urlPattern = new RegExp(
        '^(https?:\\/\\/)?' + // http:// or https://
        '([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}' + // domain name and extension
        '(\\/[^\\s]*)?$' // path
    );
    
    const s3BucketPattern = new RegExp('^[a-z0-9.-]{3,63}$'); // bucket name constraints
    
    const s3BucketKeyPattern = new RegExp('^[a-z0-9.-]{3,63}\\/[a-zA-Z0-9-._~:?#[\\]@!$&\'()*+,;%=]+$'); // bucket name and key
    
    const s3BucketPathPattern = new RegExp('^[a-z0-9.-]{3,63}\\/([a-zA-Z0-9-._~:?#[\\]@!$&\'()*+,;%=]+\\/)+$'); // bucket name and path ending with /

    if (urlPattern.test(inputString)) {
        return "URL";
    } else if (s3BucketKeyPattern.test(inputString)) {
        return "S3 Bucket Name and Key";
    } else if (s3BucketPathPattern.test(inputString)) {
        return "S3 Bucket Name and Path";
    } else if (s3BucketPattern.test(inputString)) {
        return "S3 Bucket Name";
    } else {
        return "Invalid Input";
    }
}

export function generateDataAccessCode(input, action) {
    const inputType = identifyInputType(input);

    let responseMessage;

    if (action === 'python') {
        if (inputType === "URL") {
            responseMessage = `from urllib.request import urlretrieve\nurlretrieve("${input}")`;
        } else if (inputType === "S3 Bucket Name") {
            responseMessage = `import boto3\nfrom botocore import UNSIGNED\nfrom botocore.config import Config\nimport os\n\nbucket_name = "${input}"\npath = "./"\ns3 = boto3.resource('s3', config=Config(signature_version=UNSIGNED))\ns3_client = boto3.client('s3', config=Config(signature_version=UNSIGNED))\nbucket = s3.Bucket(bucket_name)\nfor obj in bucket.objects.all():\n    key = obj.key\n    print(key)\n    file_path = path + key\n    if not os.path.isfile(file_path):\n        s3_client.download_file(bucket_name, key, file_path)`;
        } else if (inputType === "S3 Bucket Name and Key") {
            const [bucketName, key] = input.split('/', 2);
            responseMessage = `import boto3\nfrom botocore import UNSIGNED\nfrom botocore.config import Config\nimport os\n\nkey = "${key}"\nbucket_name = "${bucketName}"\npath = "./"\nif not os.path.isfile(path+key):\n    s3 = boto3.resource('s3', config=Config(signature_version=UNSIGNED))\n    s3_client = boto3.client('s3', config=Config(signature_version=UNSIGNED))\n    s3_client.download_file(bucket_name, key, path + key)\nelse:\n    print(file_path + " already downloaded")`;
        } else if (inputType === "S3 Bucket Name and Path") {
            const [bucketName, ...pathArray] = input.split('/');
            const path = pathArray.join('/');
            responseMessage = `import boto3\nfrom botocore import UNSIGNED\nfrom botocore.config import Config\nimport os\n\nbucket_name = "${bucketName}"\npath = "${path}"\nsession = boto3.Session()\ns3 = session.client('s3', config=Config(signature_version=UNSIGNED))\nresponse = s3.list_objects_v2(Bucket=bucket_name, Prefix=path)\nfor obj in response['Contents']:\n    if (obj['Key'] === path) {\n        continue;\n    }\n    file_name = obj['Key'].split("/").pop()\n    if (!os.path.isfile(path + file_name)) {\n        s3_client.download_file(bucket_name, obj['Key'], path + file_name)\n    } else {\n        print(path + file_name + " already downloaded")\n    }\n}`;
        } else {
            responseMessage = "Invalid Input";
        }
    } else if (action === 'iguide') {
        responseMessage = `download_to_notebook("${input}")`;
    } else {
        responseMessage = "Invalid Action";
    }
    
    return responseMessage;
}

// Example usage:
const input = "data/test";
const action = "python";
const message = generateDataAccessCode(input, action);
console.log(message);
