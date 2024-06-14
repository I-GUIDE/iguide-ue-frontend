export async function DataRetriever(data_name) {
    const response = await fetch(`http://149.165.169.173:3000/api/resources?data_name=${data_name}`);
    if (!response.ok) {
        throw new Error(`Error fetching ${data_name}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}
DataRetriever('notebook').then(result => {
    console.log(result); // Print the result to the console
});
