import {
  Button,
  InputNumber,
  Panel,
  Popover,
  Radio,
  RadioGroup,
  Table,
  Whisper,
} from "rsuite";
import { useLocalStorage } from "usehooks-ts";
import NumberDisplay from "./Number";

const defaultStrength = 60;
const defaultWater = 250;
const grams_per_litre = 1000;

const strengthHelp = (
  <Popover>
    <p className="text-sm max-w-sm">
      The strength of coffee can be described in two ways: g/L and coffee to
      water ratio. Although they are two different ways of expressing it, both
      methods ultimately result in the same goal of adjusting the strength of
      the coffee according to personal preference. g/L stands for grams of
      coffee per litre of water, with 60 g/L being a nice number. The coffee to
      water ratio describes the relationship between the amount of coffee and
      water used, i.e. 1:15 is 1 gram of coffee to 15 grams of water.
    </p>
  </Popover>
);

const round = (num: number, places = 2) => {
  if (places == 0) {
    return Math.round(num);
  }
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
};

// convert strength to coffee and water. So 60g/L would be 0.06 coffee, where is
// a ratio of 1:16.66. So given 60 we should return 16.66
const strength_to_ratio = (strength: number) => {
  return 1 / (strength / grams_per_litre);
};

// convert the ratio back to strength. So 1:16.66 would be 60g/L
const ratio_to_strength = (ratio: number) => {
  return grams_per_litre / ratio;
};

const grams_to_ounces = (grams: number) => {
  return grams * 0.035274;
};

const ounces_to_grams = (ounces: number) => {
  return ounces / 0.035274;
};

const waterChoices = [200, 250, 300, 500];
const waterChoicesOunces = [6, 8, 10, 12, 16];
const waterPercents = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

const strengthChoices = [55, 57, 60, 63, 65];
const strengthChoicesRatios = [15, 16, 17, 18];

function App({
  setTheme,
  theme,
}: {
  setTheme: (theme: string) => void;
  theme: string;
}) {
  const [strength, setStrength] = useLocalStorage("strength", defaultStrength);
  const [water, setWater] = useLocalStorage("water", defaultWater);

  const grams_of_coffee = water * (strength / grams_per_litre);

  const data = waterPercents.map((percent) => {
    const water_amt = round(water * percent, 1);
    return {
      percent: `${round(percent * 100, 0)}%`,
      water: water_amt,
    };
  });

  const waterTable = (
    <Table
      virtualized
      bordered
      data={data}
      autoHeight
      width={300}
      className="mt-2"
    >
      <Table.Column align="center" fixed flexGrow={1}>
        <Table.HeaderCell>Percent</Table.HeaderCell>
        <Table.Cell dataKey="percent" />
      </Table.Column>
      <Table.Column align="center" flexGrow={1}>
        <Table.HeaderCell>Water (g)</Table.HeaderCell>
        <Table.Cell dataKey="water" />
      </Table.Column>
    </Table>
  );

  // the output for the recipe
  const recipe = (
    <div className="flex flex-row space-x-4 place-items-center transition-all">
      <Panel bordered shaded>
        <NumberDisplay
          label="Coffee"
          value={round(grams_of_coffee, 1)}
          unit="g"
        />
      </Panel>
      <Panel bordered shaded>
        <NumberDisplay label="Water" value={round(water, 1)} unit="g" />
      </Panel>
    </div>
  );

  const strengthHeader = <span className="text-lg font-bold">Coffee</span>;
  const waterHeader = <span className="text-lg font-bold">Water</span>;
  const websiteHeader = (
    <div className="flex flex-col text-center mt-16 md:mt-0">
      <span className="font-bold text-4xl mb-2">Brew Math</span>
      <span className="text-sm text-gray-500">
        A simple tool to help you brew coffee
      </span>
    </div>
  );

  const themes = ["light", "dark", "high-contrast"];
  const themeToggle = (
    <RadioGroup
      inline
      appearance="picker"
      value={theme}
      className="w-fit absolute top-0 left-0 m-4"
    >
      {themes.map((theme) => {
        return (
          <Radio
            value={theme}
            onChange={(value) => {
              setTheme(value?.toString() ?? "dark");
            }}
          >
            {theme}
          </Radio>
        );
      })}
    </RadioGroup>
  );

  // simple section linking to the github repo
  const githubSection = (
    <div className="flex flex-row justify-center">
      <a href="https://www.github.com/cgbur/brew-math" target="_blank">
        <span className="text-sm text-gray-500">Github</span>
      </a>
    </div>
  );

  const container = (
    <div className="flex flex-col space-y-2 w-full p-2">
      {themeToggle}
      <div className="flex flex-row justify-center">{websiteHeader}</div>
      <div className="flex flex-row flex-wrap justify-center">
        <Panel bordered header={strengthHeader} className="m-2 relative">
          {strength != defaultStrength && (
            <Button
              appearance="subtle"
              className="absolute top-0 right-0 m-2"
              onClick={() => {
                setStrength(defaultStrength);
              }}
            >
              Reset
            </Button>
          )}
          <div className="flex space-y-2 flex-col">
            <InputNumber
              min={40}
              max={100}
              type="number"
              value={round(strength, 2)}
              onChange={(value) => {
                setStrength(Number(value));
              }}
              size="lg"
              postfix={
                <span className="text-sm text-gray-300 font-mono">g/L</span>
              }
            />
            <RadioGroup
              inline
              appearance="picker"
              value={strength}
              className="w-fit h-10"
            >
              {strengthChoices.map((step) => (
                <Radio
                  key={step}
                  value={step}
                  onChange={() => setStrength(step)}
                  className="w-11"
                >
                  {" "}
                  {`${step}g`}
                </Radio>
              ))}
            </RadioGroup>

            <InputNumber
              min={10}
              max={25}
              type="number"
              value={round(strength_to_ratio(strength), 2)}
              onChange={(value) => {
                const strength = ratio_to_strength(Number(value));
                setStrength(strength);
              }}
              step={0.1}
              size="lg"
              postfix={
                <span className="text-sm text-gray-300 font-mono">c:w</span>
              }
            />
            <RadioGroup
              inline
              appearance="picker"
              value={strength_to_ratio(strength)}
              className="w-fit h-10"
            >
              {strengthChoicesRatios.map((step) => (
                <Radio
                  key={step}
                  value={step}
                  onChange={() => {
                    const strength = ratio_to_strength(step);
                    setStrength(strength);
                  }}
                  className="w-12"
                >
                  {" "}
                  {`1:${step}`}
                </Radio>
              ))}
            </RadioGroup>
            <Whisper
              placement="top"
              trigger="active"
              controlId="control-id-active"
              speaker={strengthHelp}
            >
              <Button appearance="subtle">Coffee Strength?</Button>
            </Whisper>
          </div>
        </Panel>
        <Panel bordered header={waterHeader} className="m-2 relative">
          {water != defaultWater && (
            <Button
              appearance="subtle"
              className="absolute top-0 right-0 m-2"
              onClick={() => {
                setWater(defaultWater);
              }}
            >
              Reset
            </Button>
          )}
          <div className="flex space-y-2 flex-col">
            <InputNumber
              min={10}
              max={1000}
              type="number"
              value={round(water, 1)}
              onChange={(value) => {
                setWater(Number(value));
              }}
              step={50}
              size="lg"
              postfix={
                <span className="text-sm text-gray-300 font-mono">g</span>
              }
            />
            <RadioGroup
              inline
              appearance="picker"
              value={water}
              // make the height fixed so it doesn't change when the value changes
              className="w-fit h-10"
            >
              {waterChoices.map((step) => (
                <Radio key={step} value={step} onChange={() => setWater(step)}>
                  {" "}
                  {`${step}g`}
                </Radio>
              ))}
            </RadioGroup>
            <InputNumber
              min={1}
              max={45}
              type="number"
              value={grams_to_ounces(water)}
              onChange={(value) => {
                setWater(ounces_to_grams(Number(value)));
              }}
              step={1}
              size="lg"
              postfix={
                <span className="text-sm text-gray-300 font-mono">oz</span>
              }
            />
            <RadioGroup
              inline
              appearance="picker"
              value={grams_to_ounces(water)}
              // make the height fixed so it doesn't change when the value changes
              className="w-fit h-10"
            >
              {waterChoicesOunces.map((step) => (
                <Radio
                  key={step}
                  value={step}
                  onChange={() => setWater(ounces_to_grams(step))}
                >
                  {" "}
                  {`${step}oz`}
                </Radio>
              ))}
            </RadioGroup>
          </div>
        </Panel>
      </div>
      <div className="flex flex-col place-items-center">{recipe}</div>
      <div className="flex flex-col place-items-center">{waterTable}</div>
      <div className="flex flex-col place-items-center">{githubSection}</div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      {container}
    </div>
  );
}

export default App;
