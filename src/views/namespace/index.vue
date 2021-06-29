<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px" :inline="true">
      <el-form-item label="ID">
        <el-input v-model="form.id" placeholder="ID" clearable id="input_id" />
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="form.code" placeholder="编码" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="200">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="编码" width="200">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" align="center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getNamespaceList } from "@/api/namespace";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      form: {},
      currentPage4: 1,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getNamespaceList().then((response) => {
        this.list = response.data.items;
        this.listLoading = false;
      });
    },
    onSubmit() {
        this.fetchData();
    },
    handleSizeChange() {
        this.fetchData();
    },
    handleCurrentChange() {
        this.fetchData();
    },
  },
};
</script>
