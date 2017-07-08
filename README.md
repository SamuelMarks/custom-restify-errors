custom-restify-errors
=====================

Custom errors for the Node.JS restify framework.

If using TypeScript, install `typings` with:

    typings install github:SamuelMarks/custom-restify-errors/custom-restify-errors.d.ts --save

Otherwise just use the [custom-restify-errors-dist](https://github.com/SamuelMarks/custom-restify-errors-dist) compiled output.

## Miscellaneous

Clone [custom-restify-errors-dist](https://github.com/SamuelMarks/custom-restify-errors-dist) one dir above where this repo was cloned, then synchronise with:

    find -type f -not -name "*.ts" -and -not -path "./.git/*" -and -not -path "./node-modules/*" -and -not -name '*.map' | cpio -pdamv ../custom-restify-errors-dist
