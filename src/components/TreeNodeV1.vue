<template>

  <div
    class="tree-node"
    :style="{
      marginLeft: `${node.depth * 35}px`
    }"
  >

    <!-- ============================== -->
    <!-- NGƯỜI -->
    <!-- ============================== -->

    <div class="person-row">

      <span class="generation-badge">
        Đời {{ node.person.generation }}
      </span>

      <router-link
        :to="`/nguoi/${node.person.ID}`"
        class="person-link"
      >

        {{ getPersonName(node.person) }}

      </router-link>

      <span class="person-id">
        {{ node.person.ID }}
      </span>

    </div>


    <!-- ============================== -->
    <!-- DÂU / RỂ -->
    <!-- ============================== -->

    <div
      v-for="spouse in node.spouses"
      :key="spouse.ID"
      class="spouse-row"
    >

      <span class="spouse-icon">
        💍
      </span>

      <span class="spouse-label">
        Dâu/Rể:
      </span>

      <router-link
        :to="`/nguoi/${spouse.ID}`"
        class="spouse-link"
      >

        {{ getPersonName(spouse) }}

      </router-link>

      <span class="person-id">
        {{ spouse.ID }}
      </span>

    </div>


    <!-- ============================== -->
    <!-- CÁC CON -->
    <!-- ============================== -->

    <div class="children">

      <TreeNode
        v-for="child in node.children"
        :key="child.person.ID"
        :node="child"
      />

    </div>

  </div>

</template>


<script setup>

defineOptions({
  name: 'TreeNode'
});


defineProps({

  node: {
    type: Object,
    required: true
  }

});


// ======================================
// HIỂN THỊ TÊN
// ======================================

function getPersonName(person) {

  const ho =
    person['Họ'] || '';

  const ten =
    person['Tên'] || '';

  const tenTu =
    person['Tên Tự'] || '';

  return [
    ho,
    ten,
    tenTu
  ]
    .filter(Boolean)
    .join(' ');

}

</script>


<style scoped>

.tree-node {
  margin-bottom: 10px;
}


/* ======================================
   NGƯỜI
====================================== */

.person-row {

  display: flex;

  align-items: center;

  gap: 10px;

  min-height: 42px;

  padding: 8px 12px;

  border-left: 4px solid #198754;

  background: #f8f9fa;

  border-radius: 6px;

}


.generation-badge {

  display: inline-block;

  min-width: 65px;

  font-size: 0.8rem;

  color: #6c757d;

}


.person-link {

  font-weight: 600;

  text-decoration: none;

}


.person-id {

  font-size: 0.8rem;

  color: #6c757d;

}


/* ======================================
   DÂU / RỂ
====================================== */

.spouse-row {

  display: flex;

  align-items: center;

  gap: 8px;

  margin-top: 4px;

  margin-left: 35px;

  padding: 5px 10px;

  font-size: 0.9rem;

  border-left: 2px solid #dee2e6;

}


.spouse-icon {
  font-size: 0.9rem;
}


.spouse-label {

  color: #6c757d;

  font-size: 0.8rem;

}


.spouse-link {

  text-decoration: none;

  font-weight: 500;

}


/* ======================================
   CON
====================================== */

.children {

  margin-top: 6px;

}

</style>