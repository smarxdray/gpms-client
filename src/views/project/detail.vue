<template>
  <div class="components-container">
    <!-- eslint-disable-next-line -->
    <div class="editor-content" v-html="postForm.title"/>
    <div class="editor-content" v-html="postForm.content"/>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getProjectById } from "@/api/project";
import { getNotices } from "@/api/notice";

const defaultForm = {
  teacher: 0,
  status: -1,
  title: "", // 文章题目
  content: "", // 文章内容
  createTime: new Date(),
  updateTime: new Date()
};

export default {
  name: "NoticeDetail",
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      tempRoute: {}
    };
  },
  computed: {
    contentShortLength() {
      return this.postForm.content.length;
    },
    lang() {
      return this.$store.getters.language;
    }
  },
  created() {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
      this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    fetchData(id) {
      getProjectById(id).then(response => {
        let payload = response.data;
        this.postForm = payload.data;
        this.setTagsViewTitle();
      })
      .catch(err => {
        console.log(err);
      });
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '公告详情' : 'Notic Detail'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('updateVisitedView', route)
    },
  }
};
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>
