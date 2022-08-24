# Testssl.sh Action

A GitHub Action for scanning a host with [testssl.sh](https://testssl.sh) and comparing the result against a minimum accepted grade.

## Inputs

- `host`: The host to scan with testssl.sh (**Required**)
- `image`: Docker image to run testssl.sh (Default: `drwetter/testssl.sh`)
- `output`: Folder for scan reports (Default: `output`)
- `grade`: Minimum accepted grade (Default: `A+`)
- `options`: Additionnal testssl.sh CLI options (Default: `--jsonfile /data --csvfile /data --htmlfile /data`)

## Outputs

The scan result will be placed in the output folder, the result will be available as `html`, `json` and `csv` following the naming convension `${NODE}-p${port}${YYYYMMDD-HHMM}.(html|json|csv)`

## Example usage

```yml
- name: testssl.sh Scan
  uses: mbogh/test-ssl-action@v1
  with:
    host: 'example.com'
- uses: actions/upload-artifact@v2
  if: always()
  with:
    name: testssl.sh reports
    path: 'output/*'
```
