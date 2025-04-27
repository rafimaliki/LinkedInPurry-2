function generateMockChatListItems(count: number) {
  const maleNames = ["John", "Michael", "David", "Robert", "James"];
  const femaleNames = ["Emma", "Sophia", "Olivia", "Isabella", "Ava"];

  const getRandomItem = (arr: string[]): string =>
    arr[Math.floor(Math.random() * arr.length)];
  const getRandomDate = () => {
    const date = new Date(Date.now() - Math.random() * 1e10);
    return date.toISOString().split("T")[0];
  };

  const items = [];
  for (let i = 0; i < count; i++) {
    const isMale = Math.random() > 0.5;
    const username = isMale
      ? getRandomItem(maleNames)
      : getRandomItem(femaleNames);
    const picture = `https://randomuser.me/api/portraits/${
      isMale ? "men" : "women"
    }/${Math.floor(Math.random() * 20) + 1}.jpg`;
    const lastMessage = `Hello, this is a sample message from ${username}`;
    const date = getRandomDate();

    items.push({ username, picture, lastMessage, date, user_id: i });
  }

  return items;
}

const chatlistdata = generateMockChatListItems(10);

export default chatlistdata;
