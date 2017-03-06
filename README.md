# simple2ofx
A command line utility to convert JSON transactions from simple.com into the equivalent OFX file.
The resulting file can then be imported into most financial management programs.

## Installation

> npm install -g simple2ofx

## Usage
You can display usage info with `-h`.

```
$ simple2ofx -h
Usage: simpleofx -a [account number] -f [input file] -o [output file]

Options:
  -f, --file    The json file to convert                              [required]
  -o, --output  The destination of the new ofx file                   [required]
  -a, --acct    Specify the account number involved in the transactions
                                                               [default: "0000"]
  -h, --help    Show help     
```

