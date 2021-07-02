<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="ID" :label-width="formLabelWidth" v-show="show.id">
        <el-input
          v-model="form.id"
          autocomplete="off"
          :disabled="disabled.id"
        ></el-input>
      </el-form-item>
      <el-form-item label="编码" :label-width="formLabelWidth">
        <el-input
          v-model="form.code"
          autocomplete="off"
          :disabled="disabled.code"
        ></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          v-model="form.description"
          autocomplete="off"
          :disabled="disabled.description"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit" v-show="show.submit"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { createNamespace, updateNamespace } from "@/api/namespace";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: {},
    },
    dialog_type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      disabled: {
        id: false,
        code: false,
        description: false,
      },
      show: {
        id: true,
        submit: true,
      },
      title: "",
      formLabelWidth: "80px",
    };
  },
  computed: {
    dialogFormVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  watch: {
    dialog_type() {
      console.log("dialog_type：" + this.dialog_type);
      switch (this.dialog_type) {
        case "create":
          this.title = "创建";
          this.show.id = false;
          this.disabled.id = false;
          this.disabled.code = false;
          this.disabled.description = false;
          this.show.submit = true;
          break;
        case "update":
          this.title = "更新";
          this.show.id = true;
          this.disabled.id = true;
          this.disabled.code = true;
          this.disabled.description = false;
          this.show.submit = true;
          break;
        case "detail":
          this.title = "查看详情";
          this.show.id = true;
          this.disabled.id = true;
          this.disabled.code = true;
          this.disabled.description = true;
          this.show.submit = false;
          break;
        default:
          break;
      }
    },
  },
  methods: {
    onSubmit() {
      console.log("this.form" + JSON.stringify(this.form));
      switch (this.dialog_type) {
        case "create":
          this.createNamespaceHandler();
        case "update":
          this.updateNamespaceHandler();
      }
    },
    createNamespaceHandler() {
      createNamespace(this.form).then((response) => {
        if (response.code === 0) {
          this.$message.success("创建成功!");
          this.dialogFormVisible = false;
          this.$emit("refreshList");
        }
      });
    },
    updateNamespaceHandler() {
      let update_data = {
        description: this.form.description,
      };
      updateNamespace(this.form.id, update_data).then((response) => {
        if (response.code === 0) {
          this.$message.success("更新成功!");
          this.dialogFormVisible = false;
          this.$emit("refreshList");
        }
      });
    },
  },
};
</script>