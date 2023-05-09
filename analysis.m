files = dir("data");
filenames = {files.name};
ntrials = length(filenames)-2;

fulldata = table();
for i=1:ntrials
    filename=filenames{i+2};
    onedata = readtable(strcat("data/",filename));
    fulldata = [fulldata; onedata];
end
fulldata = fulldata(fulldata.birth_time<12000,:);
fulldata.std = std([fulldata.vision,fulldata.strength,fulldata.energy_efficiency]')';

% birth_time on x-axis
data = discretize_data(fulldata,48,"birth_time");

birth_time = data.mean_birth_time;
lifespan = data.mean_lifespan;
offspring = data.mean_offspring;

% f = figure;
% scatter(birth_time,lifespan);
% xlabel("Birth time");
% ylabel("Lifespan");
% saveas(f,"lifespan_birth-time.png");
% close(f);
% 
% f = figure;
% scatter(birth_time,offspring);
% xlabel("Birth time");
% ylabel("Number of offspring");
% saveas(f,"offspring_birth-time.png");
% close(f);


% average_size on x-axis
fulldata = fulldata(fulldata.birth_time>=3000,:);
data = discretize_data(fulldata2,20,"average_size");

average_size = data.mean_average_size;
lifespan = data.mean_lifespan;
offspring = data.mean_offspring .* average_size;
adhesion = data.mean_adhesion;
vision = data.mean_vision;
strength = data.mean_strength;
energy = data.mean_energy_efficiency;
std = data.mean_std;

% f = figure;
% scatter(average_size,lifespan);
% xlabel("Average organism size");
% ylabel("Lifespan");
% saveas(f,"lifespan_size.png");
% close(f);
% 
% f = figure;
% scatter(average_size,offspring);
% xlabel("Average organism size");
% ylabel("Number of offspring");
% saveas(f,"offspring_size.png");
% close(f);

% f = figure;
% hold on;
% scatter(average_size,std);
% xlabel("Average organism size");
% ylabel("Average skill standard deviation");
% p = polyfit(average_size,std,1);
% x = linspace(0,210);
% y = p(1)*x+p(2);
% plot(x,y);
% saveas(f,"std_size.png");
% close(f);

f = figure;
hold on;
% fulldata = fulldata(fulldata.birth_time>=5000,:);
% data = discretize_data(fulldata,20,"average_size");
scatter(average_size,adhesion);
p = polyfit(average_size,adhesion,1);
x = linspace(0,210);
y = p(1)*x+p(2);
plot(x,y);
xlabel("Average organism size");
ylabel("Adhesion");
saveas(f,"adhesion_size.png");
close(f);
