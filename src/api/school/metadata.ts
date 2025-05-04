export const getDataGradeListApi = () => {
  return apiSchool.get("school-metadata/grades");
};

export const getDataClassListApi = (params: object) => {
  return apiSchool.get("school-metadata/classes", params);
};
