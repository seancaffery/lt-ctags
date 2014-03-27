## Ctags LightTable Plugin

Jump to definition based on tags file.

### Usage

The regular LightTable jump to definition and jump back
shortcuts (`ctrl-.`, `ctrl-,`) can be used in any editor with
the ctags behaviours added. By default only Ruby editors are configured.

It is recommended that [Ripper tags](https://github.com/tmm1/ripper-tags)
is used to generate the tags file, if you are using Ruby.

[Exuberant Ctags](http://ctags.sourceforge.net/) is recommended
for other languages.

### Behaviour Configuration

By default, editors with the `ruby` tag will have the jump to
definition behaviour. This behaviour attempts to handle Ruby
special cases.

You can add basic jump to definition to other editor types by
adding the following to your behaviours file.

```
:editor.javascript [:lt.plugins.ctags/simple-jump-to-definition]}}
```

### Contributing

Please report any issues that you find. Examples where this
plugin falls down for languages other than Ruby would be great.

Pull requests welcome :)

### Contributors
Sean Caffery
Beau Fabry

### License
MIT
