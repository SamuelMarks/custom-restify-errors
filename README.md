restify-errors
==============

Custom errors for the Node.JS restify framework.

If using TypeScript, install `typings` with:

    typings install github:SamuelMarks/restify-errors/restify-errors.d.ts --save

Otherwise just use the [restify-errors-dist](https://github.com/SamuelMarks/restify-errors-dist) compiled output.

## Miscellaneous

Clone [restify-errors-dist](https://github.com/SamuelMarks/restify-errors-dist) one dir above where this repo was cloned, then synchronise with:

    find -type f -not -name "*.ts" -and -not -path "./.git/*" -and -not -path "./node-modules/*" -and -not -name '*.map' | cpio -pdamv ../restify-errors-dist
