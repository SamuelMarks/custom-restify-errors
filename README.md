custom-restify-errors
=====================

Custom errors for the Node.JS restify framework.

If using TypeScript, install `typings` with:

    typings install github:SamuelMarks/custom-restify-errors/custom-restify-errors.d.ts --save

Otherwise just use the [custom-restify-errors-dist](https://github.com/SamuelMarks/custom-restify-errors-dist) compiled output.

## Miscellaneous

Clone [custom-restify-errors-dist](https://github.com/SamuelMarks/custom-restify-errors-dist) one dir above where this repo was cloned, then synchronise with:

     dst="${PWD##*/}"-dist;
     find -type f -not -path './node_modules*' -a -not -path './.git*' -a -not -path './.idea*' -a -not -path './typings*' -a -not -name '*.ts' -not -name 'ts*' | cpio -pdamv ../"$dst";
     sed -i "s/${PWD##*/}/$dst/g" ../"$dst"/{*.md,*.json};

## License

Licensed under either of

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or <https://www.apache.org/licenses/LICENSE-2.0>)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or <https://opensource.org/licenses/MIT>)

at your option.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall be
dual licensed as above, without any additional terms or conditions.
