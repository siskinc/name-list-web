<template>
  <el-dialog
    title="更新命名空间"
    :visible.sync="dialogFormVisible"
  >
    <el-form :model="form">
      <el-form-item label="ID" :label-width="formLabelWidth">
        <el-input
          v-model="form.id"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="命名空间" :label-width="formLabelWidth">
        <el-input
          v-model="form.namespace"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="名单类型编码" :label-width="formLabelWidth">
        <el-input
          v-model="form.code"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="'字段[' + multiValue.field + ']'"
        :label-width="formLabelWidth"
        v-for="multiValue in form.multi_value"
        :key="multiValue.field"
      >
        <el-input
          v-model="multiValue.value"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="是否生效" :label-width="formLabelWidth">
        <el-select v-model="form.is_valid_str" placeholder="请选择是否生效">
          <el-option label="生效" value="true"></el-option>
          <el-option label="失效" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="业务额外属性[JSON]"
        :label-width="formLabelWidth"
        prop="extra"
      >
        <el-input
          type="textarea"
          v-model="form.extra_str"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit"> 确 定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateListItem } from "@/api/list-item";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      formLabelWidth: "180px",
      form: {
        "id": "",
        "namespace": "",
        "code": "",
        "is_valid_str": "false",
        "extra_str": "{}",
        "multi_value": []
      }
    };
  },
  methods: {
    dialogChange() {
      this.form = _.clone(this.selectData);
      this.form.extra_str = JSON.stringify(this.form.extra);
      this.form.is_valid = this.form.is_valid ? "true" : "false";
    },
    handleUpdateListItem(data) {
      updateListItem(data.id, data).then((response) => {
        if (response.code === 0) {
          this.$message.success("更新成功!");
        }
      });
    },
    onSubmit() {
      let data = _.clone(this.form);
      data.is_valid = data.is_valid_str == "true";
      data.extra = JSON.parse(data.extra_str);
      this.handleUpdateListItem(data);
      this.$emit("refreshTable");
      this.dialogFormVisible = false;
    },
  },
  created() {
    this.dialogChange();
  },
  computed: {
    dialogFormVisible: {
      get: function () {
        return this.visible;
      },
      set: function () {
        this.$emit("closeDialog");
      },
    },
  },
  watch: {
    visible: function () {
      this.dialogChange();
    },
  },
};
</script>