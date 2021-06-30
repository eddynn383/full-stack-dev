FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

FilePond.setOptions({
    credits: false,
    // stylePanelAspectRatio: 120 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 120
})

FilePond.parse(document.body)