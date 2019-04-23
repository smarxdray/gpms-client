<template>
  <div class="components-container">
    <div class="editor-container">
      <dropzone
        id="myVueDropzone"
        url="http://localhost:8086/files/upload"
        @dropzone-removedFile="dropzoneR"
        @dropzone-success="dropzoneS"
      />
    </div>
  </div>
</template>

<script>
import Dropzone from "@/components/Dropzone";

export default {
  name: "DropzoneDemo",
  components: { Dropzone },
  methods: {
    dropzoneS(file) {
    this.$message({ message: "Upload success", type: "success" });
    },
    dropzoneR(file) {
      this.$message({ message: "Delete success", type: "success" });
    }
  }
};
</script>

