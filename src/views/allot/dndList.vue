<template>
  <div class="components-container">
    <el-cascader
      :options="options"
      placeholder="下拉选项双击选择"
      size="large"
      @active-item-change="handleItemChange"
      @change="handleValueChange"
      :props="props"
    ></el-cascader>
    <div style="text-align:right;">
        <!-- <el-button type="danger" @click="dialogVisible=false">{{ $t('permission.cancel') }}</el-button> -->
        <el-button
          type="primary"
          @click="confirm"
          :disabled="!this.selectedTeacher.id"
        >{{ $t('permission.confirm') }}</el-button>
      </div>
    <div class="editor-container">
      <dnd-list
        :list1="allottedStudents"
        :list2="restStudents"
        :list1-title="list1Title"
        list2-title="待分配学生"
      />
    </div>
  </div>
</template>

<script>
import DndList from "@/components/DndList";
import {
  getTeachers,
  getTeachersByMajor,
  getStudentsWithoutTeacher,
  getStudentsByTeacher
} from "@/api/user";
import { getColleges, getMajorsByCollege } from "@/api/info";
import { assign, unassign, setAssignment } from "@/api/transaction";
import i18n from "@/lang";

export default {
  name: "DndListDemo",
  components: { DndList },
  data() {
    return {
      options: [],
      props: {
        value: "id",
        label: "name",
        children: "children"
      },
      selectedOptions: [],
      selectedCollege: {},
      selectedMajor: {},
      selectedTeacher: {
        id: null
      },
      allottedStudents: [],
      restStudents: []
    };
  },
  computed: {
    list1Title() {
      return !this.selectedTeacher.id
        ? "请先选择一位导师"
        : "拖拽右侧学生到此处以分配给该导师";
    }
  },
  created() {
    this.getColleges();
  },
  methods: {
    handleItemChange(val) {
      let length = val.length;
      if (length == 1) {
        let collegeId = val[0];
        this.selectedCollege = this.options.find(c => c.id == collegeId);
        if (!this.selectedCollege.hasOwnProperty("init")) {
          getMajorsByCollege(collegeId).then(
            res => {
              if (res.data.code != 200) {
                return this.$notify({
                  message: res.msg,
                  type: "warning"
                });
              }
              let majors = res.data.data;
              majors.forEach(m => (m.children = []));
              this.selectedCollege.children = majors;
              this.selectedCollege["init"] = true;
            },
            err => {
              this.$notify.error({
                message: err
              });
            }
          );
        }
      } else if (length == 2) {
        let majorId = val[1];
        this.selectedMajor = this.selectedCollege.children.find(
          m => m.id == majorId
        );
        if (!this.selectedMajor.hasOwnProperty("init")) {
          getTeachersByMajor(majorId).then(
            res => {
              if (res.data.code != 200) {
                return this.$notify({
                  message: res.msg,
                  type: "warning"
                });
              }
              let teachers = res.data.data;
              teachers = teachers.map(t => {
                return t.basic;
              });
              this.selectedMajor.children = teachers;
              this.selectedMajor["init"] = true;
            },
            err => {
              this.$notify.error({
                message: err
              });
            }
          );
        }
      }
    },
    handleValueChange(val) {
      if (val.length == 3) {
        this.selectedTeacher.id = val[2];
        getStudentsByTeacher(this.selectedTeacher.id).then(res => {
          let body = res.data;
          if (body.code != 200) {
            return this.$notify({
              message: body.msg
            })
          }
          this.allottedStudents = body.data;
        });
        getStudentsWithoutTeacher().then(
          res => {
            let body = res.data;
            if (body.code != 200) {
              return this.$notify({
                message: body.msg,
                type: "warning"
              });
            }
            let students = body.data;
            this.restStudents = students.filter(
              s => {
                if (s.detail) {
                  return s.detail.major == this.selectedMajor.id;
                } else return false
              }
            );
          },
          err => {
            this.$notify.error({
              message: err
            });
          }
        );
      }
    },
    getColleges() {
      getColleges().then(res => {
        let body = res.data;
        this.options = body.data;
        this.options.forEach(c => (c.children = []));
      });
    },
    confirm() {
      let assignedStudentDetails = [];
      this.allottedStudents.forEach(s => {
        assignedStudentDetails.push({  // studentDetail
          id: s.detail.id,
          owner: s.basic.id,
          teacher: this.selectedTeacher.id
        });
      });
      // assign(assignedStudentDetails)
      //   .then(
      //     res => {
      //       let payload = res.data;
      //       let success = payload.code == 200;
      //       this.$notify({
      //         message: success ? "分配成功！" : payload.msg,
      //         type: success ? "success" : "warning"
      //       });
      //     },
      //     err => {
      //       this.$notify.error({
      //         title: "请求错误",
      //         message: err
      //       });
      //     }
      //   )
      //   .catch(err => {
      //     console.log(err);
      //   });
        let unassignedStudentDetials = [];
        this.restStudents.forEach( s => {
          unassignedStudentDetials.push({
            id: s.detail.id,
            owner: s.basic.id,
            teacher: null
          })
        });
        // unassign(unassignedStudentDetials)
        // .then(
        //   res => {
        //     let payload = res.data;
        //     let success = payload.code == 200;
        //     if (!success) this.$notify({
        //       message: payload.msg,
        //       type: "warning"
        //     });
        //   },
        //   err => {
        //     this.$notify.error({
        //       title: "请求错误",
        //       message: err
        //     });
        //   }
        // )
        // .catch(err => {
        //   console.log(err);
        // });
        setAssignment(assignedStudentDetails, unassignedStudentDetials) 
        .then(
          res => {
            let payload = res.data;
            let success = payload.code == 200;
            this.$notify({
              message: success ? "分配成功！" : payload.msg,
              type: success ? "success" : "warning"
            });
          },
          err => {
            this.$notify.error({
              title: "请求错误",
              message: err
            });
          }
        )
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

