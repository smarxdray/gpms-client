<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :class-name="'sub-navbar '+postForm.status">
        <!-- <CommentDropdown v-model="postForm.comment_disabled" /> -->
        <PlatformDropdown v-if="!toSpecialOne" v-model="postForm.type" :roles="roles"/>
        <!-- <SourceUrlDropdown v-model="postForm.source_uri" /> -->
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitForm"
        >发布</el-button>
      </sticky>

          
      <div class="createPost-main-container">
        <el-row>
          <!-- <Warning/> -->

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>标题</MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item v-if="availableReceivers.length > 0" label-width="80px" label="发送给:" class="postInfo-container-item">
                    <el-select
                      v-model="receiver"
                      placeholder="请选择用户"
                    >
                      <el-option
                        v-for="item in availableReceivers"
                        :key="item.id"
                        :label="`[${item.code}] ${item.name}`"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker
                      v-model="postForm.displayTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label-width="60px" label="重要性:" class="postInfo-container-item">
                    <el-rate
                      v-model="postForm.importance"
                      :max="3"
                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      :low-threshold="1"
                      :high-threshold="3"
                      style="margin-top:8px;"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要:">
          <el-input
            v-model="postForm.contentShort"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="请输入内容"
          />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
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
import { getUserById, getAdmins, getTeachers, getStudents } from "@/api/user";
import { userSearch } from "@/api/remoteSearch";
import Warning from "./Warning";
import {
  CommentDropdown,
  PlatformDropdown,
  SourceUrlDropdown
} from "./Dropdown";

const defaultForm = {
  author: 0,
  status: 0,
  title: "", // 文章题目
  content: "", // 文章内容
  contentShort: "", // 文章摘要
  imgUri: "", // 文章图片
  displayTime: null, // 前台展示时间
  id: null,
  type: 0,
  commentDisabled: false,
  importance: 0
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
      receiver: undefined,
      availableReceivers: [],
      postForm: Object.assign({}, defaultForm),
      loading: false,
      roles: this.$store.getters.roles,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: "blur" }]
      },
      dialogVisible: false,
      toSpecialOne: false,
      tempRoute: {}
    };
  },
  computed: {
    type() {
      return this.postForm.type
    },
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
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
    } else {
      this.postForm = Object.assign({}, defaultForm);
      this.postForm.author = this.$store.getters.user.id;
      let receiver = this.$route.query.to;
      if (receiver) {
        this.toSpecialOne = true;
        this.receiver = parseInt(receiver);
        this.postForm.type = 5;
        getUserById(receiver).then(res => {
          this.availableReceivers = [res.data.data]
        })
      }
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route);
  },
  watch: {
    type(newVal, oldVal) {
      if (this.toSpecialOne) return;
      switch(newVal) {
        // 全体师生（含管理员）
        case 0: 
          this.availableReceivers = [];
        break;
        // 全体导师
        case 1: 
          this.availableReceivers = [];
        break;
        // 全体学生
        case 2: 
          this.availableReceivers = [];
        break;
        // 本人全体学生
        case 3:
          this.availableReceivers = [];
        break;
        // 管理员私信
        case 4:
          this.setAvailableReceivers(getAdmins);
        break;
        // 导师私信
        case 5:
          this.setAvailableReceivers(getTeachers);
        break;
        // 学生私信
        case 6:
          this.setAvailableReceivers(getStudents);
        break;
      }
    }
  },
  methods: {
    fetchData(id) {
      fetchArticle(id)
        .then(response => {
          this.postForm = response.data;
          // Just for test
          this.postForm.title += `   Article Id:${this.postForm.id}`;
          this.postForm.contentShort += `   Article Id:${this.postForm.id}`;

          // Set tagsview title
          this.setTagsViewTitle();
        })
        .catch(err => {
          console.log(err);
        });
    },
    setAvailableReceivers(promise) {
      promise().then(res => {
        let payload = res.data;
        let success = payload.code == 200;
        if (success) {
          this.availableReceivers = payload.data;
        }
      });
    },
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
          let privateNotice;
          if (this.receiver != null && this.receiver != undefined && this.receiver != '') {
            privateNotice = {receiver: this.receiver}
          } else {
            privateNotice = null;
          }
          let notice = {
            basic: this.postForm,
            detail: privateNotice
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
