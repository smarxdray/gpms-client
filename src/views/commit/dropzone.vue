<template>
  <div class="components-container">
    <div class="editor-container">
      <dropzone
        id="myVueDropzone"
        url="http://localhost:8086/upload"
        @dropzone-removedFile="dropzoneR"
        @dropzone-success="dropzoneS"
      />
    </div>
    <a href="http://localhost:8086/download/3">下载文件</a>
  </div>
</template>

<script>
import Dropzone from "@/components/Dropzone";
import { download} from '@/api/transaction'

export default {
  name: "DropzoneDemo",
  components: { Dropzone },
  methods: {
    dropzoneS(file) {
      console.log(file);
      this.$message({ message: "Upload success", type: "success" });
      download(3).then(res => {
        console.log(res)
      })
    },
    dropzoneR(file) {
      console.log(file);
      this.$message({ message: "Delete success", type: "success" });
    }
  }
};
</script>

