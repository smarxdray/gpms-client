<template>
  <div class="components-container">
    <code>drag-list base on
      <a href="https://github.com/SortableJS/Vue.Draggable" target="_blank">Vue.Draggable</a>
    </code>
    <el-select v-model="teacherSelected" placeholder="请先选择导师">
    <el-option
      v-for="item in teacherList"
      :key="item.id"
      :label="item.name"
      :value="item">
    </el-option>
  </el-select>
    <div class="editor-container">
      <dnd-list :list1="studentsAlloted" :list2="studentsRest" :list1-title="list1Title" list2-title="待分配学生" />
      <div style="text-align:right;">
        <!-- <el-button type="danger" @click="dialogVisible=false">{{ $t('permission.cancel') }}</el-button> -->
        <el-button type="primary" @click="confirm" :disabled="!Object.keys(teacherSelected).length">{{ $t('permission.confirm') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import DndList from '@/components/DndList'
import { getTeachers, getStudentsWithoutTeacher } from '@/api/user'
import { assign } from '@/api/transaction'
import i18n from "@/lang"

export default {
  name: 'DndListDemo',
  components: { DndList },
  data() {
    return {
      teacherList: [],
      teacherSelected: {},
      studentsAlloted: [],
      studentsRest: []
    }
  },
  computed: {
    list1Title() {
      if (!Object.keys(this.teacherSelected).length) return '请先选择一位导师'
      else {
        return `拖拽右侧学生到此处以分配给导师${this.teacherSelected.name}`
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.listLoading = true
      getTeachers().then(res => {
        const body = res.data;
        this.teacherList = body.data;
      })
      getStudentsWithoutTeacher().then(res => {
        const body = res.data;
        this.studentsRest = body.data;
      })
    },
    confirm() {
      let matches = [];
      this.studentsAlloted.forEach(s => {
        matches.push({
          owner: s.basic.id,
          teacher: this.teacherSelected.id
        })
      })
      console.log(matches)
      assign(matches).then(res => {
        let payload = res.data;
        let success = payload.code == 200;
        this.$notify({
          message: success ? '分配成功！' : payload.msg,
          type: success ? 'success' : 'warning'
        })
      }, err => {
        this.$notify.error({
          title: "请求错误",
          message: err
        })
      }).catch(err => {
        console.log(err)
      });
    }
  }
}
</script>

