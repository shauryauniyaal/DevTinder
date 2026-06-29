const fixSkills = (req) => {
  if (req?.body.skills) {
    req.body.skills = [
      ...new Set(
        req.body.skills
          .map((s) => s.trim().toLowerCase())
          .filter((s) => s.length > 0),
      ),
    ];
  }
};

module.exports = fixSkills;
