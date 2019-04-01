<template>
  <div class="components-container">
    <!-- eslint-disable-next-line -->
    <div class="editor-content" v-html="postForm.content"/>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { fetchArticle } from "@/api/article";

const defaultForm = {
  status: "draft",
  title: "", // 文章题目
  content: `<h1 style="text-align: center;">Welcome to the TinyMCE demo!</h1><p style="text-align: center; font-size: 15px;"><img title="TinyMCE Logo" src="//www.tinymce.com/images/glyph-tinymce@2x.png" alt="TinyMCE Logo" width="110" height="97" /><ul>
        <li>Our <a href="//www.tinymce.com/docs/">documentation</a> is a great resource for learning how to configure TinyMCE.</li><li>Have a specific question? Visit the <a href="https://community.tinymce.com/forum/">Community Forum</a>.</li><li>We also offer enterprise grade support as part of <a href="https://tinymce.com/pricing">TinyMCE premium subscriptions</a>.</li>
      </ul>`, // 文章内容
  content_short: "", // 文章摘要
  source_uri: "", // 文章外链
  image_uri: "", // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ["a-platform"],
  comment_disabled: false,
  importance: 0
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
      return this.postForm.content_short.length;
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
      fetchArticle(id).then(response => {
        this.postForm = response.data;
        // Just for test
        this.postForm.title += `   Article Id:${this.postForm.id}`;
        this.postForm.content_short += `   Article Id:${this.postForm.id}`;
        // Set tagsview title
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
