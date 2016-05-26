restify-errors
==============

Custom errors for the Node.JS restify framework.

If using TypeScript, install `typings` with:

    typings install github:SamuelMarks/restify-errors/restify_errors.d.ts --save

Otherwise just use the [restify-errors-dist](https://github.com/SamuelMarks/restify-errors-dist) compiled output.

## Miscellaneous

Clone the dist repo in the same directory this repo was cloned into, then you can synchronise them with:

    find -type f -not -name "*.ts" -and -not -path "./.git/*" -and -not -path "./node_modules/*" -and -not -name '*.map' | cpio -pdamv ../restify-errors-dist
