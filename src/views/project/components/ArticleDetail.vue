<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" type="warning" @click="saveAsDraft">保存</el-button>
      </sticky>
      <div class="createPost-main-container">
          <Warning/>

            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>标题</MDinput>
            </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400"/>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import Upload from "@/components/Upload/singleImage3";
import MDinput from "@/components/MDinput";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { validURL } from "@/utils/validate";
import { fetchArticle } from "@/api/article";
import { addNotice } from "@/api/notice";
import { getProjectById, addProjects} from "@/api/project";
import { getStudents } from "@/api/user";
import { userSearch } from "@/api/remoteSearch";
import Warning from "./Warning";
import {
  CommentDropdown,
  PlatformDropdown,
  SourceUrlDropdown
} from "./Dropdown";

const defaultForm = {
  teacher: 0,
  status: -1,
  title: "", // 文章题目
  content: "", // 文章内容
  createTime: new Date(),
  updateTime: new Date()
};

export default {
  name: "ArticleDetail",
  components: {
    Tinymce,
    MDinput,
    Upload,
    Sticky,
    Warning,
    CommentDropdown,
    PlatformDropdown,
    SourceUrlDropdown
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "为必传项",
          type: "error"
        });
        callback(new Error(rule.field + "为必传项"));
      } else {
        callback();
      }
    };
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback();
        } else {
          this.$message({
            message: "外链url填写不正确",
            type: "error"
          });
          callback(new Error("外链url填写不正确"));
        }
      } else {
        callback();
      }
    };
    return {
      receivers: [],
      availableReceivers: [],
      postForm: Object.assign({}, defaultForm),
      loading: false,
      roles: this.$store.getters.roles,
      userListOptions: [],
      rules: {
        // image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        // source_uri: [{ validator: validateSourceUri, trigger: "blur" }]
      },
      dialogVisible: false,
      key: 'projectList',
      tempRoute: {}
    };
  },
  computed: {
    contentShortLength() {
      return this.postForm.contentShort.length;
    },
    lang() {
      return this.$store.getters.language;
    },
    name() {
      return this.$store.getters.name;
    }
  },
  created() {
    if (this.isEdit) {
      let id = this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm);
      this.postForm.teacher = this.$store.getters.user.id;
    }
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    saveAsDraft() {
      this.postForm.createTime = new Date();
      this.postForm.updateTime = new Date();
      this.postForm.status = -1;
      addProjects([this.postForm]).then(res => {
        let success = res.data.code == 200;
        if (!success) {
          this.$notify({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
      this.$router.push({
        name: 'ProjectList'
      })
    },
    fetchData(id) {
      getProjectById(id).then(res => {
        let payload = res.data;
        console.log(res)
        this.postForm = payload.data;

          // Set tagsview title
          this.setTagsViewTitle();
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAvailableReceivers() {
      // switch(this.postForm.type) {

      // }
      this.getStudents();
      
    },
    getStudents() {
      getStudents().then(res => {
        let payload = res.data;
        let success = payload.code == 200;
        if (success) {
          this.availableReceivers = payload.data;
        }
      });
    },
    confirm() {},
    setTagsViewTitle() {
      const title = this.lang === "zh" ? "编辑通知" : "Edit Notice";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.postForm.id}`
      });
      this.$store.dispatch("updateVisitedView", route);
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let privateDetails = this.receivers.map(r => {
            return {receiver: r.id}
          })
          let notice = {
            notice: this.postForm,
            privateDetails
          }
          addNotice(notice)
            .then(
              res => {
                let payload = res.data;
                let success = payload.code == 200;
                console.log(payload);
                this.$notify({
                  message: success ? "发布成功！" : payload.msg,
                  type: success ? "success" : "warning"
                });
              },
              err => {
                this.$notify.error({
                  message: err
                });
              }
            )
            .catch(err => {
              conosole.log(err);
            });
          this.postForm.status = 1; // published
          this.loading = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    draftForm() {
      if (
        this.postForm.content.length === 0 ||
        this.postForm.title.length === 0
      ) {
        this.$message({
          message: "请填写必要的标题和内容",
          type: "warning"
        });
        return;
      }
      this.$message({
        message: "保存成功",
        type: "success",
        showClose: true,
        duration: 1000
      });
      this.postForm.status = "draft";
    },
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return;
        this.userListOptions = response.data.items.map(v => v.name);
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
