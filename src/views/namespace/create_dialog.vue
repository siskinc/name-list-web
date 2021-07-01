<template>
  <el-dialog
    title="创建新的命名空间"
    :visible.sync="dialogFormVisible"
    center="true"
  >
    <el-form :model="form">
      <el-form-item label="编码" :label-width="formLabelWidth">
        <el-input v-model="form.code" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          v-model="form.description"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmitWithCreate">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createNamespace } from "@/api/namespace";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {},
    };
  },
  computed: {
    dialogFormVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        console.log(val);
        this.$emit("update:visible", val);
      },
    },
  },
  methods: {
    onSubmitWithCreate() {
      console.log("this.form"+JSON.stringify(this.form));
      createNamespace(this.form).then((response) => {
        if (response.code === 0) {
          this.$message({
            message: "创建成功!",
            type: "success",
          });
          this.dialogFormVisible = false;
          this.$emit("refreshList");
        } else {
          this.$message({
            message: "创建失败!",
            type: "error",
          });
        }
      });
    },
  },
};
</script>